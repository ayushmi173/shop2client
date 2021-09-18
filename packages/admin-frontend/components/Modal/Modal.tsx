import React, { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';
import Icon from '../Icon';

type Props = {
  children?: React.ReactNode;
  trigger: JSX.Element;
  hideCross?: boolean;
  className?: string;
  isClose?: boolean;
  onClose?: () => void;
};

const Modal: React.FC<Props> = ({
  children,
  trigger,
  hideCross = false,
  className,
  isClose = false,
  onClose,
}) => {
  const popupRef: React.MutableRefObject<PopupActions | null> = useRef<PopupActions | null>(
    null,
  );
  const close = () => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const [isCloseModal, setIsCloseModal] = useState(false);

  useEffect(() => {
    close();
  }, [isClose, isCloseModal]);

  return (
    <Popup
      trigger={trigger}
      ref={popupRef}
      modal
      closeOnDocumentClick
      className="modal"
      onClose={() => onClose && onClose()}
    >
      <div className={className || 'bg-white py-4 px-5 rounded-lg'}>
        {hideCross === false && (
          <div
            className="inline-block absolute right-6 top-6 cursor-pointer"
            onClick={() => setIsCloseModal(!isCloseModal)}
          >
            <Icon name="circleCross" width={35} height={34} fill="black" />
          </div>
        )}
        {children}
      </div>
    </Popup>
  );
};

export default Modal;
