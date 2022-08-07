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
} from '@chakra-ui/react';
import { useState } from 'react';

export const WaitModal = ({ onSubmit, isOpen, onClose }) => {
	const [waitTime, setWaitTime] = useState(1000);
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Wait</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>How long (milliseconds):</Text>
						<NumberInput
							onChange={(v) => setWaitTime(parseInt(v))}
							value={waitTime}
							min={3}
							step={1000}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
						<Text>Minimum 3ms</Text>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={() => {
								onSubmit(waitTime);
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
