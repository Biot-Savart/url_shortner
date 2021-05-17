<template>
 <div class="container">
			<h1>URL Shrinker</h1>
				<b-input
					required
					placeholder="URL"
					type="url"
					name="fullUrl"
					id="fullUrl"
					v-model="fullUrl"
					class="url-input">
				</b-input>
				<b-button
					type="is-info"
					@click="addUrl">
					Shrink/Search This!
				</b-button>				
				<p>
					<a target="_blank" :href="newShort">{{ newShort }}</a>
					<span class="error">{{errorMsg}}</span>
				</p>

			<table class="table table-striped table-responsive">
				<thead>
					<tr>
						<th>Full URL</th>
						<th>Short URL</th>
						<th>Complete Short URL</th>
						<th>Clicks</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in allUrls" :key="item.short">
						<td field="full">{{item.full}}</td>
						<td field="short"><a target="_blank" :href="item.shortUrl">{{item.short}}</a></td>
						<td field="short"><a target="_blank" :href="item.shortUrl">{{item.shortUrl}}</a></td>
						<td field="short">{{item.clicks}}</td>
					</tr>
				</tbody>
			</table>
		</div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
export default {
  name: 'HelloWorld',
	props: {
		msg: String,
	},
	data() {
		return {
			apiUrl: `http://${window.location.hostname}:5000`,
			fullUrl: "http://",
			allUrls: null,
			newShort: "",
			errorMsg: ""
		}
	},
	methods: {
		async addUrl() {
			const res = await axios.post(`${this.apiUrl}/short?fullUrl=${this.fullUrl}`);
			this.errorMsg = "";
			if (res.data.error) {
				this.errorMsg = res.data.error;
				this.newShort = "";
			}
			else
				this.newShort = `${this.apiUrl}/${res.data.short}`;

			this.getAllUrls();
		},
		async getAllUrls() {
			const res = await axios.get(this.apiUrl);

			this.allUrls = _.map(res.data, d => {
				d.shortUrl = this.apiUrl + "/" + d.short;
				return d;
			});
		}
	}
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	font-weight: bold;
	color: #42b983;
	font-size: 2rem;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
  margin-top: 5px;
}

table {
	width: 50%;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10px;
}

th {
	color: white;
	background-color: #42b983;
}

tbody td {
	text-align: left !important;
}

.error {
	color: red;
	font-weight: bold;
	margin-top: 5px;
}

.url-input {
	max-width: 600px;
	margin-left: auto;
	margin-right: auto;
	padding: 10px;
}

button {
	margin: 5px 0 5px 0;
}
</style>
