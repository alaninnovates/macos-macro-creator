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
	Stack,
	RadioGroup,
	Radio,
} from '@chakra-ui/react';
import { useState } from 'react';
import { PressType } from './PressType';

export const ClickModal = ({ onSubmit, isOpen, onClose }) => {
	const [clickPosition, setClickPosition] = useState('mouse');
	const [clickCoords, setClickCoords] = useState({
		x: 0,
		y: 0,
	});
	const [type, setType] = useState('down');

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Click</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<RadioGroup
							value={clickPosition}
							onChange={(v) => setClickPosition(v)}
						>
							<Stack>
								<Radio value="custom" isDisabled>
									<Text>Custom position:</Text>
								</Radio>
								<Radio value="mouse">
									<Text>Mouse position</Text>
								</Radio>
							</Stack>
						</RadioGroup>
						<PressType type={type} setType={setType} />
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={() => {
								onSubmit({
									clickPosition,
									coords: clickCoords,
									type,
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
