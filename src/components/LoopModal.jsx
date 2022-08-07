import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Text,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	RadioGroup,
	Radio,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';

export const LoopModal = ({ onSubmit, isOpen, onClose }) => {
	const [loopAmountType, setLoopAmountType] = useState('custom');
	const [loopAmount, setLoopAmount] = useState(5);
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Wait</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>How many times do you want to loop?</Text>
						<RadioGroup
							onChange={setLoopAmountType}
							value={loopAmountType}
						>
							<Stack>
								<Radio value="custom">
									Custom amount of times
								</Radio>
								<Radio value="forever">Forever</Radio>
							</Stack>
						</RadioGroup>
						{loopAmountType === 'custom' && (
							<>
								<Text>How many times:</Text>
								<NumberInput
									onChange={(v) => setLoopAmount(v)}
									value={loopAmount}
									min={2}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</>
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={() => {
								onSubmit({
									loopAmountType,
									loopAmount,
								});
								onClose();
							}}
						>
							Add
						</Button>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
