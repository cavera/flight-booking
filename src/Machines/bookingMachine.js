import { createMachine, assign } from 'xstate';
import { fetchCountries } from '../Utils/api';

const fillCountries = {
	initial: 'loading',
	states: {
		loading: {
			invoke: {
				id: 'getCountries',
				src: () => fetchCountries(),
				onDone: {
					target: 'success',
					actions: assign({
						countries: (context, event) => event.data,
					}),
				},
				onError: {
					target: 'failure',
					actions: assign({
						error: 'Paises no encontrados en el request',
					}),
				},
			},
		},
		success: {},
		failure: {
			on: {
				RETRY: { target: 'loading' },
			},
		},
	},
};

const bookingMachine = createMachine(
	{
		id: 'buy plane tickets',
		initial: 'initial',
		context: {
			passengers: [],
			selectedCountry: '',
			countries: [],
			error: '',
		},
		states: {
			initial: {
				on: {
					START: {
						target: 'search',
						actions: 'imprimirInicio',
					},
				},
			},
			search: {
				on: {
					CONTINUE: {
						target: 'passengers',
						actions: assign({
							selectedCountry: (context, event) => event.selectedCountry,
						}),
					},
					CANCEL: {
						target: 'initial',
						actions: 'resetDatos',
					},
				},
				...fillCountries,
			},
			passengers: {
				on: {
					DONE: {
						target: 'tickets',
						cond: 'moreThanOnePassenger',
					},
					CANCEL: {
						target: 'initial',
						actions: 'resetDatos',
					},
					ADD: {
						target: 'passengers',
						actions: assign((context, event) => context.passengers.push(event.newPassenger)),
					},
				},
			},
			tickets: {
				after: {
					5000: {
						target: 'initial',
						actions: 'resetDatos',
					},
				},
				on: {
					FINISH: 'initial',
				},
			},
		},
	},
	{
		actions: {
			imprimirInicio: () => console.log('log de inicio'),
			resetDatos: assign({
				selectedCountry: '',
				passengers: [],
			}),
		},
		guards: {
			moreThanOnePassenger: context => {
				return context.passengers.length > 0;
			},
		},
	}
);

export default bookingMachine;
