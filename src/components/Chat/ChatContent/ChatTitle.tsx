import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import useStore from '@store/store';
import ConfigMenu from '@components/ConfigMenu';
import { ChatInterface, ConfigInterface } from '@type/chat';
import { _defaultChatConfig, modelName } from '@constants/chat';

const ChatTitle = React.memo(() => {
  const { t } = useTranslation('model');
  const config = useStore(
    (state) =>
      state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
        ? state.chats[state.currentChatIndex].config
        : undefined,
    shallow
  );
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const advancedMode = useStore((state) => state.advancedMode);
  const saveRef = useRef<HTMLDivElement>(null);

  const model = useStore((state) =>
    state.chats
      ? state.chats[state.currentChatIndex].config.model
      : 'gpt-3.5-turbo'
  );

  const setConfig = (config: ConfigInterface) => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats[currentChatIndex].config = config;
    setChats(updatedChats);
  };

  // for migrating from old ChatInterface to new ChatInterface (with config)
  useEffect(() => {
    const chats = useStore.getState().chats;
    if (chats && chats.length > 0 && currentChatIndex !== -1 && !config) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats[currentChatIndex].config = { ..._defaultChatConfig };
      setChats(updatedChats);
    }
  }, [currentChatIndex]);

  return config ? (
    <>
      <div
        className='relative gap-x-4 gap-y-1 flex-wrap w-full items-center justify-center border-b border-black/10 bg-gray-50 p-2 dark:border-gray-900/50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hidden md:flex'>
        <div className='cursor-pointer text-center p-2 rounded-md bg-gray-300/20 dark:bg-gray-900/10 hover:bg-gray-300/50 dark:hover:bg-gray-900/50' onClick={() => {
          setIsModalOpen(true);
        }}>
          {/* {t('model')}:  */}
          {modelName[model]} {advancedMode ? '('+t('advancedMode')+')':''}
        </div>

      </div>
      {isModalOpen && (
        <ConfigMenu
          setIsModalOpen={setIsModalOpen}
          config={config}
          setConfig={setConfig}
        />
      )}
    </>
  ) : (
    <></>
  );
});

export default ChatTitle;
