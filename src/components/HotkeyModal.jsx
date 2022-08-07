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
} from '@chakra-ui/react';
import { useState } from 'react';

export const HotkeyModal = ({ onSubmit, isOpen, onClose, currentHotkey }) => {
	const [hotkey, setHotkey] = useState(currentHotkey);
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Set Hotkey</ModalHeader>
					<ModalCloseButton />
					<ModalBody>Your current hotkey is: {hotkey}</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={() => {
								onSubmit(hotkey);
								onClose();
							}}
						>
							Set
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
