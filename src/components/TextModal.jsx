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
	Code,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Keyboard } from './Keyboard';
import { PressType } from './PressType';

export const TextModal = ({ onSubmit, isOpen, onClose }) => {
	const [text, setText] = useState('');
	const [type, setType] = useState('down');

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Text</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize="xl">
							Text: <Code>{text}</Code>
						</Text>
						<Text mb={4}>
							Keys will be typed one character at a time
						</Text>
						<Button
							onClick={() => {
								let lastElement = text[text.length - 1];
								if (lastElement === '}') {
									let textTmp = text;
									while (lastElement !== '{') {
										textTmp = textTmp.slice(0, -1);
										lastElement =
											textTmp[textTmp.length - 1];
									}
									setText(textTmp.slice(0, -1));
								} else setText(text.slice(0, -1));
							}}
						>
							Backspace
						</Button>
						<Keyboard onPress={(key) => setText(`${text}${key}`)} />
						<PressType type={type} setType={setType} />
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={() => {
								onSubmit({
									text,
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
