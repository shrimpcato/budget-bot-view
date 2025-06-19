
// Simple Google Sheets data fetcher without Google Cloud API
// Uses the CSV export method for public sheets

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  range: string; // e.g., "A1:B12" or "A:B"
}

export interface CategoryMapping {
  category: string;
  sheetConfig: SheetConfig;
}

export interface FinancialDataMapping {
  key: string;
  sheetConfig: SheetConfig;
}

// Default configuration - user can modify these values
export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  spreadsheetId: "your-spreadsheet-id-here", // Replace with your actual spreadsheet ID
  sheetName: "Sheet1", // Replace with your sheet name
  range: "A2:B13" // Assuming categories in column A, values in column B
};

// Category mappings - user can customize these
export const CATEGORY_MAPPINGS: CategoryMapping[] = [
  { category: "Debt & Loan", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A2:B2" } },
  { category: "Entertainment", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A3:B3" } },
  { category: "Family", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A4:B4" } },
  { category: "Food", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A5:B5" } },
  { category: "Health", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A6:B6" } },
  { category: "Housing", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A7:B7" } },
  { category: "Investment", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A8:B8" } },
  { category: "Shopping", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A9:B9" } },
  { category: "Subscription", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A10:B10" } },
  { category: "Transport", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A11:B11" } },
  { category: "Work & Education", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A12:B12" } },
  { category: "Others", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A13:B13" } }
];

// Financial data mappings - add these to your sheet
export const FINANCIAL_DATA_MAPPINGS: FinancialDataMapping[] = [
  { key: "totalBudget", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A14:B14" } },
  { key: "totalIncome", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A15:B15" } },
  { key: "incomeGrowth", sheetConfig: { ...DEFAULT_SHEET_CONFIG, range: "A16:B16" } }
];

// Fetch data from Google Sheets using CSV export (works with public sheets)
export const fetchSheetData = async (config: SheetConfig): Promise<any[]> => {
  try {
    // Method 1: CSV export (requires public sheet)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/export?format=csv&gid=0`;
    
    console.log(`Fetching data from: ${csvUrl}`);
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split(','));
    
    return rows;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
};

// Parse range string (e.g., "A2:B2" -> {startRow: 2, endRow: 2, startCol: 1, endCol: 2})
export const parseRange = (range: string) => {
  const [start, end] = range.split(':');
  const startCol = start.charAt(0).charCodeAt(0) - 65; // A=0, B=1, etc.
  const startRow = parseInt(start.slice(1)) - 1; // Convert to 0-based index
  
  if (end) {
    const endCol = end.charAt(0).charCodeAt(0) - 65;
    const endRow = parseInt(end.slice(1)) - 1;
    return { startRow, endRow, startCol, endCol };
  }
  
  return { startRow, endRow: startRow, startCol, endCol: startCol };
};

// Get specific cell value from sheet data
export const getCellValue = (data: any[], range: string): string | number => {
  const { startRow, startCol } = parseRange(range);
  
  if (data[startRow] && data[startRow][startCol]) {
    const value = data[startRow][startCol];
    // Try to parse as number, otherwise return as string
    const numValue = parseFloat(value);
    return isNaN(numValue) ? value : numValue;
  }
  
  return 0;
};

// Fetch all category data
export const fetchAllCategoryData = async () => {
  const colors = [
    "#00D4FF", "#FF6B35", "#00FFB7", "#FFD700", "#FF1493", 
    "#00CED1", "#FF69B4", "#32CD32", "#FF4500", "#1E90FF", 
    "#FF6347", "#40E0D0"
  ];
  
  try {
    // Fetch the main sheet data once
    const sheetData = await fetchSheetData(DEFAULT_SHEET_CONFIG);
    
    if (sheetData.length === 0) {
      console.warn('No data fetched from sheet, using sample data');
      // Return sample data if sheet fetch fails
      return CATEGORY_MAPPINGS.map((mapping, index) => ({
        name: mapping.category,
        value: Math.floor(Math.random() * 500) + 100,
        color: colors[index % colors.length]
      }));
    }
    
    // Map each category to its corresponding data
    return CATEGORY_MAPPINGS.map((mapping, index) => {
      const value = getCellValue(sheetData, mapping.sheetConfig.range);
      return {
        name: mapping.category,
        value: typeof value === 'number' ? value : 0,
        color: colors[index % colors.length]
      };
    });
  } catch (error) {
    console.error('Error fetching category data:', error);
    // Return sample data as fallback
    return CATEGORY_MAPPINGS.map((mapping, index) => ({
      name: mapping.category,
      value: Math.floor(Math.random() * 500) + 100,
      color: colors[index % colors.length]
    }));
  }
};

// Fetch financial data (budget, income, etc.)
export const fetchFinancialData = async () => {
  try {
    const sheetData = await fetchSheetData(DEFAULT_SHEET_CONFIG);
    
    if (sheetData.length === 0) {
      // Return sample data if sheet fetch fails
      return {
        totalBudget: 5000,
        totalIncome: 6500,
        incomeGrowth: 8.5
      };
    }
    
    const financialData: any = {};
    FINANCIAL_DATA_MAPPINGS.forEach((mapping) => {
      const value = getCellValue(sheetData, mapping.sheetConfig.range);
      financialData[mapping.key] = typeof value === 'number' ? value : 0;
    });
    
    return {
      totalBudget: financialData.totalBudget || 5000,
      totalIncome: financialData.totalIncome || 6500,
      incomeGrowth: financialData.incomeGrowth || 8.5
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return {
      totalBudget: 5000,
      totalIncome: 6500,
      incomeGrowth: 8.5
    };
  }
};
