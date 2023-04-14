<template>
	<img
		src="/assets/agencies-bg.png"
		alt="Decorative Background"
		class="bg-image"
	/>
	<v-container>
		<h1 class="text-h3 mb-16 mt-8">Agencies Chart Generator</h1>
		<v-row>
			<v-col>
				<v-form>
					<p>
						Data <strong>MUST</strong> be pipe seperated.<br />
						Example: 1 | 2 | 3 | 4
					</p>
					<v-text-field
						type="text"
						placeholder="Data"
						v-model="chartData.data"
						id="data"
					/>
					<p>
						Labels <strong>MUST</strong> be pipe seperated.<br />
						Example: 2019 | 2020 | 2021 | 2022
					</p>
					<v-text-field
						type="text"
						placeholder="Labels"
						v-model="chartData.labels"
					/>
					<v-select
						label="Chart Type"
						:items="['bar', 'doughnut', 'pie']"
						v-model="chartData.type"
					>
					</v-select>
					<v-btn @click.prevent="generateChart">
						Generate Chart
					</v-btn>
					<v-btn
						@click.prevent="downloadImage"
						:disabled="chartData.imageUrl == false ? true : false"
						>Download Image</v-btn
					>
				</v-form>
			</v-col>
			<v-col>
				<div
					class="placeholder"
					:class="chartData.imageUrl ? 'd-none' : ''"
				>
					Generate a chart
				</div>
				<img
					id="chartImage"
					:src="chartData.imageUrl"
					alt="Chart"
					:class="chartData.imageUrl ? 'image-generated' : ''"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { generatePieChart } from "./generators/pieChartGenerator";
import { generateDoughnutChart } from "./generators/doughnutChartGenerator";
import { generateBarChart } from "./generators/barChartGenerator";
import { GET_WP_DATA } from "./api/_WORDPRESS_";

onMounted(() => {
	GET_WP_DATA()
		.then((response) => console.log(response.data))
		.catch((err) => console.log(err.error));
});

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
	return data.map((item) => item.replaceAll(",", "").trim());
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

const downloadImage = async () => {
	const image = await fetch(chartData.imageUrl);
	const imageBlog = await image.blob();
	const imageURL = URL.createObjectURL(imageBlog);

	const link = document.createElement("a");
	link.href = imageURL;
	link.download = `Chart-${Date.now()}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
</script>

<style>
#app {
	min-height: 100vh;
	background-color: black;
	color: white;
}

#app > div {
	position: relative;
	z-index: 1;
}
.bg-image {
	display: block;
	position: absolute;
	right: 0;
	top: 0;
	z-index: 0;
	height: 100%;
}

h1 {
	text-align: center;
}

img {
	display: none;
	max-width: 90vw;
	margin: 0 auto;
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
	max-width: 90vw;
	margin: 0 auto;
	width: 750px;
	height: 450px;
	border: 4px solid white;
	font-size: 48px;
}

.image-generated {
	display: block;
}
.d-none {
	display: none;
}
</style>
