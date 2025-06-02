import React from 'react';
import {
   Modal,
   Input,
   Button,
   Link,
   ModalHeader,
   ModalBody,
   ModalFooter,
} from "@heroui/react";

export const ModalLogin = () => {
   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);
   const closeHandler = () => {
      setVisible(false);
   };
   return (
      <div>
         <Link onClick={handler}>Login</Link>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            isOpen={visible}
            onOpenChange={setVisible}
         >
            <ModalHeader>
               <p id="modal-title" className='size-3'>
                  Welcome to
                  <p className='size-3'>
                     NextUI
                  </p>
               </p>
            </ModalHeader>
            <ModalBody>
               <Input
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Email"
               //   contentLeft={<Mail fill="currentColor" />}
               />
               <Input
                  fullWidth
                  color="primary"
                  size="lg"
                  placeholder="Password"
               //   contentLeft={<Password fill="currentColor" />}
               />
               {/* <Row justify="space-between">
                  <Checkbox>
                     <Text size={14}>Remember me</Text>
                  </Checkbox>
                  <Text size={14}>Forgot password?</Text>
               </Row> */}
            </ModalBody>
            <ModalFooter>
               <Button color="danger" onClick={closeHandler}>
                  Close
               </Button>
               <Button onClick={closeHandler}>
                  Sign in
               </Button>
            </ModalFooter>
         </Modal>
      </div>
   );
};
