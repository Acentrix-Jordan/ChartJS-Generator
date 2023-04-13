import QuickChart from "quickchart-js";

export const generateBarChart = async (data, labels) => {
	const myChart = new QuickChart();
	myChart.setConfig({
		type: "horizontalBar",
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
				},
			],
		},
		options: {
			plugins: {
				legend: false,
				tickFormat: {
					notation: "compact",
					currency: "GBP",
				},
			},
			scales: {
				xAxes: [
					{
						ticks: {
							fontColor: "#fff",
							fontSize: 26,
							callback: function (value) {
								return "£" + value;
							},
							beginAtZero: true,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							fontColor: "#fff",
							fontSize: 26,
						},
					},
				],
			},
			indexAxis: "y",
		},
	});
	// myChart.setVersion("2.9.4");
	myChart.setWidth("750");
	myChart.setHeight("450");
	myChart.setFormat("svg");
	myChart.setBackgroundColor("transparent");

	const url = await myChart.getShortUrl();

	return url;
};
