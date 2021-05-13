<template>
 <div class="container">
			<h1>URL Shrinker</h1>
			
				<label for="fullUrl" class="sr-only">URL</label>
				<input
					required
					placeholder="URL"
					type="url"
					name="fullUrl"
					id="fullUrl"
					class="form-control col mr-2"
					v-model="fullUrl"
				/>
				<button
					class="btn btn-success"
					type="submit"
					@click="addUrl"
				>
					Shrink This!
				</button>
				<p>
					<a target="_blank" :href="newShort">{{ newShort }}</a>
				</p>

			<table class="table table-striped table-responsive">
				<thead>
					<tr>
						<th>Full URL</th>
						<th>Short URL</th>
						<th>Clicks</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in allUrls" :key="item.short">
						<td field="full">{{item.full}}</td>
						<td field="short"><a target="_blank" :href="item.shortUrl">{{item.short}}</a></td>
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
			newShort: ""
		}
	},
	methods: {
		async addUrl() {
			const res = await axios.post(`${this.apiUrl}/short?fullUrl=${this.fullUrl}`);

			this.newShort = `${this.apiUrl}/${res.data.short}` ;
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
}
</style>
