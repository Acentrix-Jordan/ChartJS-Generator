import QuickChart from "quickchart-js";

export const generateDoughnutChart = async (data, labels) => {
	const myChart = new QuickChart();
	myChart.setConfig({
		type: "doughnut",
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
					],
					datalabels: {
						display: true,
						align: "center",
						backgroundColor: "#fff",
						borderRadius: 3,
						formatter: (value) => value + "%",
						font: {
							size: 26,
						},
						color: "#fff",
					},
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
		},
	});
	myChart.setWidth("750");
	myChart.setHeight("450");
	myChart.setFormat("svg");
	myChart.setBackgroundColor("transparent");

	const url = await myChart.getShortUrl();

	return url;
};
