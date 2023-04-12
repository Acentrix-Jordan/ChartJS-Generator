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
					],
				},
			],
		},
		options: {
			legend: {
				display: false,
			},
			layout: {
				padding: {
					top: 30,
					bottom: 30,
				},
			},
			plugins: {
				datalabels: {
					formatter: (value) => value + "%",
					labels: {
						index: {
							color: "#fff",
							font: {
								size: 18,
							},
							formatter: (val, ctx) =>
								ctx.chart.data.labels[ctx.dataIndex],
							align: "end",
							anchor: "end",
						},
						value: {
							color: "#404040",
							backgroundColor: "#fff",
							borderColor: "#fff",
							borderWidth: 2,
							borderRadius: 4,
							padding: 4,
							align: "bottom",
						},
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
