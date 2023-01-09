<script lang="ts">
	import {
		Container,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Row,
		Col,
	} from "sveltestrap";
	import Dexie from "dexie";
	import 'bootstrap/dist/css/bootstrap.min.css'
	import type { Table } from "dexie";
	import { Chart, LineSeries } from "svelte-lightweight-charts";

	let isOpen = false;
	const toggle = () => (isOpen = !isOpen);
	const data = [
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 },
    ]
	//IndexedDB storage wrapper
	//Typescript interface
	interface Docs {
		id?: number;
		name?: string;
		amount?: number;
	}

	class DocsDatabase extends Dexie {
		public docs!: Table<Docs, number>;
		public constructor() {
			super("DocDatabase");
			this.version(1).stores({
				docs: "++id,name,amount",
			});
		}
	}

	const db = new DocsDatabase();
	db.transaction("rw", db.docs, async () => {
		if ((await db.docs.where({ name: "Rocket" }).count()) === 0) {
			const id = await db.docs.add({ name: "Rocket", amount: 69 });

		}
		//const lowDocs = await db.docs.where("docum").below(48).toArray();
	});
  export const sitename: string = 'astroloAGI'
</script>

<main>
	<Container fluid>
		<Row class="mb-1">
			<Navbar color="dark" dark fixed="top">
				<NavbarBrand href="/" class="me-auto">astroloAGI💫</NavbarBrand>
				<NavbarToggler on:click={toggle} class="me-2" id="options" aria-label="options click" />
			</Navbar>
		</Row>
	<Row>1</Row>
	<Row>2</Row>
	<Row class='row-fluid'>
		<Col>meow</Col>
    	<Col>.col-sm-auto .offset-sm-1</Col>
	</Row>
	<!-- <py-script>
		from datetime import datetime
		now = datetime.now()
		display(now.strftime("%m/%d/%Y, %H:%M:%S"))
	</py-script> -->
	<Row>
	<Chart width={800} height={600}>
		<LineSeries data={data}/>
	</Chart>
	</Row>
	</Container>
</main>
<style>
	:global(body) {
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
