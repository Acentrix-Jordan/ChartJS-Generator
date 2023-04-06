import QuickChart from "quickchart-js";

export const generatePieChart = async (
	data,
	labels,
	title = "Enter a title"
) => {
	const myChart = new QuickChart();
	myChart.setConfig({
		type: "pie",
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					label: title,
					backgroundColor: [
						"#c27653",
						"#b63e63",
						"#711b7a",
						"#342492",
						"#31799a",
					],
				},
			],
		},
		options: {
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			},
			indexAxis: "y",
		},
	});

	const url = await myChart.getShortUrl();

	return url;
};
