export const statusOptions = [
	{ value: "pending", label: "قيد الانتظار" }, // "Pending" translated as "قيد الانتظار"
	{ value: "in-progress", label: "قيد التنفيذ" }, // "In Progress" translated as "قيد التنفيذ"
	{ value: "completed", label: "مكتمل" }, // "Completed" translated as "مكتمل"
	{ value: "cancelled", label: "ملغي" }, // "Cancelled" translated as "ملغي"
];


export const statusColors = {
  pending: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
  'in-progress': 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
  completed: 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200',
  cancelled: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
};