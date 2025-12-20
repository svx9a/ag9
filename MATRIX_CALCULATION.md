# Matrix Calculation Visualization - Technical Documentation

## Overview
The Matrix Calculation Visualization is a core feature of the AgriFlight landing page, designed to provide potential clients with real-time, data-driven insights into the ROI and operational efficiency of AgriFlight's drone fleet.

## Technical Specifications

### Architecture
- **Component**: `MatrixVisualization.tsx`
- **Logic Engine**: Integrated `useMemo` with performance optimization via `ultraOptimizer`.
- **Styling**: Tailwind CSS for responsive, accessible UI.
- **Icons**: Lucide-React.

### Data Models
The system uses the following drone specifications for calculations:
| Model | Capacity | Unit Price | Battery Cost | Coverage/Charge | Spray Rate |
|-------|----------|------------|--------------|-----------------|------------|
| 20L   | 20L      | ฿295,000   | ฿28,000      | 38 Rai          | 60 Rai/Hr  |
| 6L    | 6L       | ฿135,000   | ฿9,500       | 10 Rai          | 25 Rai/Hr  |
| 6Ls   | 6L       | ฿125,000   | ฿8,500       | 9 Rai           | 22 Rai/Hr  |

### Calculation Logic
1. **Total Charges**: `ceil(FarmSize / CoveragePerCharge)`
2. **Mission Time**: `FarmSize / SprayRate`
3. **Batteries Needed**: `min(ceil(TotalCharges / 2), 4)` (assuming continuous charging cycle)
4. **Annual Savings**: `FarmSize * (ManualCost - DroneOpCost) * SeasonsPerYear`
   - *Manual Cost*: ฿150/rai
   - *Drone Op Cost*: ฿40/rai
   - *Seasons*: 3 per year
5. **Break-Even**: `TotalInvestment / (AnnualSavings / 12)`

## Production Readiness

### Performance Optimization
- Utilizes `ultraOptimizer.auto_execute` for calculation offloading.
- Employs `useMemo` to prevent unnecessary re-renders during farm size slider adjustments.
- Uses CSS-only animations to minimize main-thread impact.

### Accessibility (WCAG 2.1 AA)
- Full ARIA attribute support (`role="dialog"`, `aria-modal`, `aria-labelledby`).
- Semantic HTML structure.
- Keyboard-navigable inputs and buttons.
- High-contrast text and interactive elements.

### Error Handling & Edge Cases
- **Large Area Alert**: Warns users if they select a 6L/6Ls model for farms > 400 Rai.
- **Minimum/Maximum Bounds**: Enforced 10-500 Rai range for realistic mission planning.

## Maintenance Guidelines
- **Updating Drone Specs**: Modify the `DRONE_MODELS` constant in `MatrixVisualization.tsx`.
- **Adjusting ROI Constants**: Update the manual labor cost and operational cost variables within the `calculations` useMemo block.
- **UI Modifications**: Ensure Tailwind utility classes maintain responsive consistency across `sm`, `md`, and `lg` breakpoints.

## Monitoring & Analytics
The component includes a mock telemetry card that simulates real-time performance tracking (Execution Speed, Memory Usage) using the `ultraOptimizer.benchmark` tool. For production, these metrics should be piped to a centralized monitoring service (e.g., Sentry, LogRocket).
