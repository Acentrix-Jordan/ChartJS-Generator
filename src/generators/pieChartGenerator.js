import QuickChart from "quickchart-js";

export const generatePieChart = async (data, labels) => {
	const myChart = new QuickChart();
	myChart.setConfig({
		type: "pie",
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: [
						"#c27653",
						"#b63e63",
						"#711b7a",
						"#342492",
						"#31799a",
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
			legend: {
				display: true,
				labels: {
					fontColor: "#fff",
					fontSize: 26,
				},
			},
			layout: {
				padding: {
					top: 30,
					bottom: 30,
				},
			},
			plugins: {
				datalabels: {
					display: true,
					align: "end",
					backgroundColor: "#000",
					borderRadius: 3,
					color: "#fff",
					formatter: (value) => value + "%",
					font: {
						size: 26,
					},
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
		},
	});
	myChart.setWidth("750");
	myChart.setHeight("450");
	myChart.setFormat("svg");
	myChart.setBackgroundColor("transparent");
	const url = await myChart.getShortUrl();

	return url;
};
