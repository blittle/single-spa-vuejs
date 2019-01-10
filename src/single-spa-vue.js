const defaultOpts = {
	// required opts
	Vue: null,
	appOptions: null,
	template: null,
}

export default function singleSpaVue(userOpts) {
	if (typeof userOpts !== 'object') {
		throw new Error(`single-spa-vue requires a configuration object`);
	}

	const opts = {
		...defaultOpts,
		...userOpts,
	};

	if (!opts.Vue) {
		throw new Error('single-spa-vuejs must be passed opts.Vue');
	}

	if (!opts.appOptions) {
		throw new Error('single-spa-vuejs must be passed opts.appOptions');
	}

	// use Vuex
	if (opts.Vuex) {
		opts.Vue.use(opts.Vuex);
	}

	// Just a shared object to store the mounted object state
	let mountedInstances = {};

	return {
		bootstrap: bootstrap.bind(null, opts, mountedInstances),
		mount: mount.bind(null, opts, mountedInstances),
		unmount: unmount.bind(null, opts, mountedInstances),
	};
}

function bootstrap(opts) {
	return Promise.resolve();
}

function mount(opts, mountedInstances, props) {
	return new Promise((resolve, reject) => {
		const {
			store,
			globalEventDistributor
		} = props;
		const vueOpt = {
			...opts.appOptions,
			store
		}
		const extendedVue = opts.Vue.extend();
		extendedVue.prototype.globalEventDistributor = globalEventDistributor;
		mountedInstances.instance = new extendedVue(vueOpt);
		resolve();
	});
}

function unmount(opts, mountedInstances) {
	return new Promise((resolve, reject) => {
		mountedInstances.instance.$destroy();
		mountedInstances.instance.$el.innerHTML = '';
		delete mountedInstances.instance;
		resolve();
	});
}
