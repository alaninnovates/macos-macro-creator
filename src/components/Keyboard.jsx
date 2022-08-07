import {
	Button,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { useEffect } from 'react';

const lowercaseKeys = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
];
const uppercaseKeys = lowercaseKeys.map((key) => key.toUpperCase());
const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const otherKeys = [
	'{ArrowRight}',
	'{ArrowLeft}',
	'{ArrowUp}',
	'{ArrowDown}',
	'{Shift}',
	'{Enter}',
	'{Backspace}',
	'{Space}',
	'{Tab}',
	'{Escape}',
	'{F1}',
	'{F2}',
	'{F3}',
	'{F4}',
	'{F5}',
	'{F6}',
	'{F7}',
	'{F8}',
	'{F9}',
	'{F10}',
	'{F11}',
	'{F12}',
];

const KeyButton = ({ text, onPress }) => (
	<Button onClick={onPress}>{text}</Button>
);

const mapToKeys = (keys, onPress) => (
	<Flex gap={2} wrap="wrap">
		{keys.map((k, i) => (
			<KeyButton key={i} text={k} onPress={() => onPress(k)} />
		))}
	</Flex>
);

export const Keyboard = ({ onPress }) => {
	useEffect(() => {
		const keyEventHandler = (e) => {
			if (
				[...lowercaseKeys, ...uppercaseKeys, ...numberKeys].some(
					(key) => e.key === key,
				)
			) {
				onPress(e.key);
			}
		};
		window.addEventListener('keydown', keyEventHandler);
		return () => {
			window.removeEventListener('keydown', keyEventHandler);
		};
	}, [onPress]);

	return (
		<Tabs>
			<TabList>
				<Tab>Lowercase</Tab>
				<Tab>Uppercase</Tab>
				<Tab>Number</Tab>
				<Tab>Other</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>{mapToKeys(lowercaseKeys, onPress)}</TabPanel>
				<TabPanel>{mapToKeys(uppercaseKeys, onPress)}</TabPanel>
				<TabPanel>{mapToKeys(numberKeys, onPress)}</TabPanel>
				<TabPanel>{mapToKeys(otherKeys, onPress)}</TabPanel>
			</TabPanels>
		</Tabs>
	);
};
