// import { PieChart, Pie, Cell, Tooltip, Legend, LegendProps } from "recharts";

// import { SPACING } from "theme";

// const COLORS = [
//   "#556EE6",
//   "#F1746C",
//   "#F8B425",
//   "#50C878",
//   "#7D6AF2",
//   "#9A9A9A",
// ];

// export const TopCategoriesWidget = () => {
//   const top5CategoriesByAmount = getTop5CategoriesByAmount();

//   interface CustomLegendProps {
//     payload: LegendProps["payload"];
//   }

//   const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
//     return (
//       <div
//         style={{
//           display: "flex",
//           gap: SPACING.spacing3x,
//           marginTop: 20,
//           flexWrap: "wrap",
//         }}
//       >
//         {payload?.map((entry, index) => (
//           <div
//             key={`item-${index}`}
//             style={{ display: "flex", alignItems: "center" }}
//           >
//             <div
//               style={{
//                 width: 16,
//                 height: 16,
//                 backgroundColor: COLORS[index],
//                 marginRight: 8,
//                 borderRadius: 90,
//               }}
//             />
//             {/*  TODO fix this type error */}
//             <span>
//               <b>{entry.payload?.name}</b> - ${entry.payload?.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <PieChart width={400} height={350}>
//       <Pie
//         data={top5CategoriesByAmount}
//         dataKey="totalAmount"
//         nameKey="category"
//         cx="50%"
//         cy="50%"
//         outerRadius={100}
//         fill="#8884d8"
//         paddingAngle={-4} // Set paddingAngle to 0 to remove the gap
//       >
//         {top5CategoriesByAmount.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//       <Tooltip />
//       <Legend content={<CustomLegend />} />
//     </PieChart>
//   );
// };
