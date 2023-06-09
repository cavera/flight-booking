import { useMachine } from '@xstate/react';
import bookingMachine from '../Machines/bookingMachine';
import { StepsLayout } from './StepsLayout';
import { Nav } from '../components/Nav';
import './BaseLayout.css';

const BaseLayout = () => {
	const [state, send] = useMachine(bookingMachine);
	console.log(state.value, state.context);

	return (
		<div className='BaseLayout'>
			<Nav
				state={state}
				send={send}
			/>
			<StepsLayout
				state={state}
				send={send}
			/>
		</div>
	);
};

export default BaseLayout;
