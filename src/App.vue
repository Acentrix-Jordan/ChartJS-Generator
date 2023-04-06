<template>
	<main>
		<h1>Chart Generator</h1>
		<div>
			<form action="">
				<p>
					Data <strong>MUST</strong> be pipe seperated.<br />
					Example: 1 | 2 | 3 | 4
				</p>
				<input
					type="text"
					placeholder="Data"
					v-model="chartData.data"
					id="data"
				/>
				<p>
					Labels <strong>MUST</strong> be pipe seperated.<br />
					Example: 2019 | 2020 | 2021 | 2022
				</p>
				<input
					type="text"
					placeholder="Labels"
					v-model="chartData.labels"
				/>
				<select
					placeholder="Chart Type"
					v-model="chartData.type"
				>
					<option value="bar">Bar</option>
					<option value="doughnut">Doughnut</option>
					<option value="pie">Pie</option>
				</select>
				<button @click.prevent="generateChart">Generate Chart</button>
				<button>Download Image</button>
			</form>
			<div>
				<div
					class="placeholder"
					:class="chartData.imageUrl ? 'd-none' : ''"
				>
					Placeholder
				</div>
				<img
					id="chartImage"
					:src="chartData.imageUrl"
					alt="Chart"
					:class="chartData.imageUrl ? 'image-generated' : ''"
				/>
			</div>
		</div>
	</main>
</template>

<script setup>
import { reactive } from "vue";
import { generatePieChart } from "./generators/pieChartGenerator";
import { generateDoughnutChart } from "./generators/doughnutChartGenerator";
import { generateBarChart } from "./generators/barChartGenerator";

const chartData = reactive({
	data: "",
	labels: "",
	type: "bar",
	sanitisedData: [],
	sanitisedLabels: [],
	imageUrl: false,
});

const parseData = async () => {
	let data = chartData.data.split("|");
	return data.map((item) => item.trim());
};

const parseLabels = async () => {
	let labels = chartData.labels.split("|");
	return labels.map((item) => item.trim());
};

const generateChart = async () => {
	let data = await parseData();
	let labels = await parseLabels();
	let chart = null;

	switch (chartData.type) {
		case "pie":
			chart = await generatePieChart(data, labels);
			break;
		case "doughnut":
			chart = await generateDoughnutChart(data, labels);
			break;
		case "bar":
			chart = await generateBarChart(data, labels);
			break;
		default:
			alert("Select a chart type");
	}

	chartData.imageUrl = chart;
};
</script>

<style scoped>
h1 {
	text-align: center;
}

main > div {
	display: flex;
	gap: 4rem;
	flex-wrap: wrap;
}

img {
	display: none;
	/* max-width: 100%; */
}

form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 80vw;
	width: 600px;
	height: 400px;
	background-color: rebeccapurple;
	font-size: 72px;
}

.image-generated {
	display: block;
}
.d-none {
	display: none;
}
</style>
