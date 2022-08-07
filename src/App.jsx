import {
	Box,
	Button,
	Center,
	Flex,
	IconButton,
	Text,
	useDisclosure,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	ButtonGroup,
} from '@chakra-ui/react';
import {
	FaArrowDown,
	FaArrowUp,
	FaMouse,
	FaPauseCircle,
	FaPlayCircle,
	FaRegKeyboard,
	FaTrash,
} from 'react-icons/fa';
import { BiImport, BiExport } from 'react-icons/bi';
import { ImLoop2 } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { WaitModal } from './components/WaitModal';
import { ClickModal } from './components/ClickModal';
import { TextModal } from './components/TextModal';
import { LoopModal } from './components/LoopModal';
import move from './util/move';
import { HotkeyModal } from './components/HotkeyModal';

const icons = {
	text: FaRegKeyboard,
	click: FaMouse,
	wait: FaPauseCircle,
	loop: ImLoop2,
};

const pressTypes = {
	down: 'Press & Hold',
	up: 'Release',
	downup: 'Press & Release',
};

const getStepValue = (step) => {
	switch (step.name) {
		case 'text':
			return (
				<>
					<Text>{step.text}</Text>
					<Text fontSize="sm">{pressTypes[step.pressType]}</Text>
				</>
			);
		case 'click':
			return (
				<>
					<Text>
						{step.clickPosition === 'custom'
							? `${step.x}, ${step.y}`
							: 'Mouse position'}
					</Text>
					<Text fontSize="sm">{pressTypes[step.pressType]}</Text>
				</>
			);
		case 'wait':
			return `${step.time}ms`;
		case 'startloop':
			return (
				<>
					<Text>Start loop</Text>
					{step.loopAmountType === 'custom' ? (
						<Text fontSize="sm">{step.loopAmount} times</Text>
					) : (
						<Text fontSize="sm">Forever</Text>
					)}
				</>
			);
		case 'endloop':
			return 'End loop';
		default:
			return '';
	}
};

function App() {
	const [macroSteps, setMacroSteps] = useState([]);
	const [currentHotkey, setCurrentHotkey] = useState(97);
	const {
		isOpen: isWaitOpen,
		onOpen: onWaitOpen,
		onClose: onWaitClose,
	} = useDisclosure();
	const {
		isOpen: isClickOpen,
		onOpen: onClickOpen,
		onClose: onClickClose,
	} = useDisclosure();
	const {
		isOpen: isTextOpen,
		onOpen: onTextOpen,
		onClose: onTextClose,
	} = useDisclosure();
	const {
		isOpen: isLoopOpen,
		onOpen: onLoopOpen,
		onClose: onLoopClose,
	} = useDisclosure();
	const {
		isOpen: isHotkeyOpen,
		onOpen: onHotkeyOpen,
		onClose: onHotkeyClose,
	} = useDisclosure();

	useEffect(() => {
		invoke('set_hotkey', { hotkey: currentHotkey });
	}, [currentHotkey]);

	return (
		<Box height="100vh">
			<Flex h={'10%'} bgColor={'gray.300'} alignItems={'center'}>
				<Flex ml={2} gap={3}>
					<IconButton icon={<icons.text />} onClick={onTextOpen} />
					<TextModal
						onSubmit={({ text, type }) =>
							setMacroSteps([
								...macroSteps,
								{ name: 'text', text, pressType: type },
							])
						}
						isOpen={isTextOpen}
						onClose={onTextClose}
					/>
					<IconButton icon={<icons.click />} onClick={onClickOpen} />
					<ClickModal
						onSubmit={({ clickPosition, coords, type }) =>
							setMacroSteps([
								...macroSteps,
								{
									name: 'click',
									clickPosition,
									coords,
									pressType: type,
								},
							])
						}
						onClose={onClickClose}
						isOpen={isClickOpen}
					/>
					<IconButton icon={<icons.wait />} onClick={onWaitOpen} />
					<WaitModal
						onSubmit={(time) =>
							setMacroSteps([
								...macroSteps,
								{ name: 'wait', time },
							])
						}
						onClose={onWaitClose}
						isOpen={isWaitOpen}
					/>
					<IconButton icon={<icons.loop />} onClick={onLoopOpen} />
					<LoopModal
						onSubmit={({ loopAmount, loopAmountType }) =>
							setMacroSteps([
								...macroSteps,
								{
									name: 'startloop',
									loopAmount,
									loopAmountType,
								},
								{
									name: 'endloop',
								},
							])
						}
						onClose={onLoopClose}
						isOpen={isLoopOpen}
					/>
				</Flex>
				<Flex ml="auto" mr={4} gap={4}>
					<IconButton icon={<BiImport />} />
					<IconButton icon={<BiExport />} />
					<Button onClick={onHotkeyOpen}>Set Hotkey</Button>
					<HotkeyModal
						onClose={onHotkeyClose}
						isOpen={isHotkeyOpen}
						currentHotkey={currentHotkey}
						onSubmit={(hotkey) => setCurrentHotkey(hotkey)}
					/>
					<IconButton
						icon={<FaPlayCircle />}
						onClick={() => {
							console.log('invoking');
							invoke('start_macro', { steps: macroSteps });
						}}
					/>
				</Flex>
			</Flex>
			<Box height={'90%'} gap={2} overflow="scroll">
				{macroSteps.length ? (
					<TableContainer>
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th>Type</Th>
									<Th>Details</Th>
									<Th>Actions</Th>
								</Tr>
							</Thead>
							<Tbody>
								{macroSteps.map((step, i) => (
									<Tr key={i}>
										<Td>{step.name}</Td>
										<Td>{getStepValue(step)}</Td>
										<Td>
											<ButtonGroup>
												<IconButton
													icon={<FaTrash />}
													onClick={() =>
														setMacroSteps(
															macroSteps.filter(
																(_s, j) =>
																	j !== i,
															),
														)
													}
												/>
												{['endloop'].some(
													(x) => step.name !== x,
												) && (
													<>
														<IconButton
															icon={<FaArrowUp />}
															onClick={() =>
																setMacroSteps(
																	move(
																		macroSteps,
																		i,
																		i - 1,
																	),
																)
															}
														/>
														<IconButton
															icon={
																<FaArrowDown />
															}
															onClick={() =>
																setMacroSteps(
																	move(
																		macroSteps,
																		i,
																		i + 1,
																	),
																)
															}
														/>
													</>
												)}
											</ButtonGroup>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				) : (
					<Center>
						<Text fontSize={'2xl'} mt={4}>
							You havent added any steps! Add some with the menu
							above.
						</Text>
					</Center>
				)}
			</Box>
		</Box>
	);
}

export default App;
