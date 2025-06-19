
import { useState, useEffect } from 'react';
import { fetchAllCategoryData, fetchFinancialData } from '../services/googleSheetsService';

export const useSheetData = () => {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any>({
    totalBudget: 5000,
    totalIncome: 6500,
    incomeGrowth: 8.5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoryResults, financialResults] = await Promise.all([
          fetchAllCategoryData(),
          fetchFinancialData()
        ]);
        setCategoryData(categoryResults);
        setFinancialData(financialResults);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading sheet data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Optionally refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [categoryResults, financialResults] = await Promise.all([
        fetchAllCategoryData(),
        fetchFinancialData()
      ]);
      setCategoryData(categoryResults);
      setFinancialData(financialResults);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return { categoryData, financialData, loading, error, refreshData };
};
