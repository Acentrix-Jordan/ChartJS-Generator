<template>
	<img
		src="/assets/agencies-bg.png"
		alt="Decorative Background"
		class="bg-image"
	/>
	<v-container>
		<h1 class="text-h3 mb-16 mt-8">Agencies Chart Generator</h1>
		<v-row justify="center">
			<v-col
				cols="12"
				md="8"
				lg="4"
			>
				<v-form>
					<v-select
						label="Project Name"
						:items="projectData.names"
						v-model="projectData.projectIndex"
						@update:modelValue="
							selectProjectHandler(projectData.projectIndex)
						"
					/>
					<v-btn
						@click.prevent="generateCharts"
						:disabled="appData.loading"
					>
						Generate Charts
					</v-btn>
					<v-progress-linear
						v-if="appData.loading"
						color="#c27653"
						model-value="20"
						:height="4"
						indeterminate
					></v-progress-linear>
					<v-btn
						@click.prevent="downloadImages"
						:disabled="appData.imageUrls == false ? true : false"
						>Download Images</v-btn
					>
				</v-form>
			</v-col>
			<v-col
				cols="12"
				sm="12"
				lg="8"
			>
				<img
					v-for="image in appData.imageUrls"
					id="chartImage"
					:src="image"
					alt="Chart"
					:class="appData.imageUrls ? 'image-generated' : ''"
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
		.then((response) => {
			let projectNames = [];
			appData.apiData = JSON.parse(response.data);
			appData.apiData.forEach((item) => {
				projectNames.push(item.acf.portfolio_project_name);
				projectData.names = projectNames;
			});
		})
		.catch((err) => console.log(err.error));
});

const appData = reactive({
	imageUrls: [],
	apiData: [],
	loading: false,
});

const projectData = reactive({
	names: [],
	projectIndex: null,
	data: {},
	revenueChart: {
		labels: [],
		data: [],
	},
	EBITDAChart: {
		labels: [],
		data: [],
	},
	revenueSourceChart: {
		labels: [],
		data: [],
	},
	serviceSourceChart: {
		labels: [],
		data: [],
	},
	clientProfileChart: {
		labels: [],
		data: [],
	},
	industriesServedChart: {
		labels: [],
		data: [],
	},
});

const selectProjectHandler = (project) => {
	const projectIndex = projectData.names.indexOf(project);
	projectData.data = appData.apiData[projectIndex].acf;

	// Revenue Data
	projectData.data.revenue_data.forEach((item) => {
		projectData.revenueChart.labels.push(item.revenue_label);
		projectData.revenueChart.data.push(item.revenue_figure);
	});

	// EBITDA Chart
	projectData.data.ebitda_data.forEach((item) => {
		projectData.EBITDAChart.labels.push(item.ebita_label);
		projectData.EBITDAChart.data.push(item.ebitda_figure);
	});

	// Service Source Chart
	projectData.data.service_source_data.forEach((item) => {
		projectData.serviceSourceChart.labels.push(item.service_source_label);
		projectData.serviceSourceChart.data.push(item.service_source_figure);
	});

	// Industries Served
	projectData.data.industries_served_data.forEach((item) => {
		projectData.industriesServedChart.labels.push(
			item.industries_served_label
		);
		projectData.industriesServedChart.data.push(
			item.industries_served_figure
		);
	});

	// Client Profile
	projectData.clientProfileChart = {
		labels: [...Object.keys(projectData.data.client_profile)],
		data: [...Object.values(projectData.data.client_profile)],
	};

	// Sanitise Client Profile Data
	projectData.clientProfileChart.labels.forEach((label, index) => {
		if (label.includes("b2b")) {
			projectData.clientProfileChart.labels[index] = "B2B";
		} else {
			projectData.clientProfileChart.labels[index] = "B2C";
		}
	});

	// Revenue Source Chart
	projectData.revenueSourceChart = {
		labels: [...Object.keys(projectData.data.revenue_source)],
		data: [...Object.values(projectData.data.revenue_source)],
	};

	// Sanitise Revenue Source Data
	projectData.revenueSourceChart.labels.forEach((label, index) => {
		if (label.includes("retainer")) {
			projectData.revenueSourceChart.labels[index] = "Retainer";
		} else {
			projectData.revenueSourceChart.labels[index] = "Project";
		}
	});
};

const generateCharts = async () => {
	appData.loading = true;

	const revenueChart = await generateBarChart(
		projectData.revenueChart.data,
		projectData.revenueChart.labels
	);

	const EBITDAChart = await generateBarChart(
		projectData.EBITDAChart.data,
		projectData.EBITDAChart.labels
	);

	const revenueSourceChart = await generateDoughnutChart(
		projectData.revenueSourceChart.data,
		projectData.revenueSourceChart.labels
	);

	const serviceSourceChart = await generateDoughnutChart(
		projectData.serviceSourceChart.data,
		projectData.serviceSourceChart.labels
	);

	const clientProfileChart = await generatePieChart(
		projectData.clientProfileChart.data,
		projectData.clientProfileChart.labels
	);

	const industriesServedChart = await generatePieChart(
		projectData.industriesServedChart.data,
		projectData.industriesServedChart.labels
	);

	appData.imageUrls = [
		revenueChart,
		EBITDAChart,
		revenueSourceChart,
		serviceSourceChart,
		clientProfileChart,
		industriesServedChart,
	];

	setTimeout(() => {
		appData.loading = false;

		// Reset Data after generation
		projectData.revenueChart = {
			data: [],
			labels: [],
		};
		projectData.EBITDAChart = {
			data: [],
			labels: [],
		};

		projectData.revenueSourceChart = {
			data: [],
			labels: [],
		};

		projectData.serviceSourceChart = {
			data: [],
			labels: [],
		};

		projectData.clientProfileChart = {
			data: [],
			labels: [],
		};

		projectData.industriesServedChart = {
			data: [],
			labels: [],
		};
	}, 1000);
};

// Loop through all images - Change Download Name
const downloadImages = async () => {
	const ChartNames = [
		"Revenue",
		"EBITDA",
		"Revenue-Source",
		"Service-Source",
		"Client-Profile",
		"Industries-Served",
	];
	for (let i = 0; i < appData.imageUrls.length; i++) {
		const image = await fetch(appData.imageUrls[i]);
		const imageBlog = await image.blob();
		const imageURL = URL.createObjectURL(imageBlog);

		const link = document.createElement("a");
		link.href = imageURL;
		link.download = `Chart-${projectData.projectIndex}-${ChartNames[i]}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
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
