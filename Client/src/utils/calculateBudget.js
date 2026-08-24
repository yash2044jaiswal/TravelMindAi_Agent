export const calculateBudgetEfficiency = (budget, totalCost) => {
  if (!budget || !totalCost) return 0
  const efficiency = ((budget - totalCost) / budget) * 100
  return Math.max(0, Math.min(100, efficiency))
}

export const getBudgetLevel = (totalCost) => {
  if (totalCost < 10000) return 'Budget'
  if (totalCost < 30000) return 'Moderate'
  if (totalCost < 60000) return 'Premium'
  return 'Luxury'
}

export const getSavingsMessage = (budget, totalCost) => {
  const savings = budget - totalCost
  if (savings > 0) {
    return `Great! You saved ₹${savings.toLocaleString()} from your budget.`
  } else if (savings < 0) {
    return `Note: This plan is ₹${Math.abs(savings).toLocaleString()} over budget.`
  }
  return 'Perfect! Your plan matches the budget exactly.'
}