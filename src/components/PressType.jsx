import { RadioGroup, Radio, Stack, Text } from '@chakra-ui/react';

export const PressType = ({ type, setType }) => (
	<>
		<Text>Press Type:</Text>
		<RadioGroup value={type} onChange={(t) => setType(t)}>
			<Stack>
				<Radio value="down">Press & Hold</Radio>
				<Radio value="up">Release</Radio>
				<Radio value="downup">Press & Release</Radio>
			</Stack>
		</RadioGroup>
	</>
);
