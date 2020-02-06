import React, { useState } from 'react';
import '../../App.css';
import css from './index.module.css';
import { useModal } from '../../hooks/use-modal';
import { useReactToVue } from '../../hooks/use-react-to-vue';
import { hookExamples, defaultExample } from '../../common/examples';
import { prettierFormat } from '../../common/utils';
import { MenuItem, Button } from '@material-ui/core';
import { DiffEditor } from '@monaco-editor/react';
import { ReactToVueEditor } from '../ReactToVueEditor';
import { Select as CustomSelect } from '../Select';

export function App() {
  const reactToVueContext = useReactToVue();
  const {
    reactCode,
    setReactCode,
    reactError,
    vueCode,
  } = reactToVueContext;
  const { Modal, ...modalContext } = useModal();
  const [activeExample, setActiveExample] = useState<string>(defaultExample.name);

  const handleSelectOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    const exampleName = event.target.value;
    const foundExample = hookExamples.find(example => example.name === exampleName);

    setActiveExample(exampleName);

    if (foundExample) {
      setReactCode(prettierFormat(foundExample.code));
    }
  }

  return (
    <div className="App">
      <h1>Use-frontend</h1>
      <p className={css.intro}>
        Transform React.js Hooks to Vue.js Composition Api
      </p>
      <CustomSelect
        title="Example"
        value={activeExample}
        onChange={handleSelectOnChange as any}
        options={hookExamples}
        renderOption={(example) => (
          <MenuItem
            key={example.name}
            value={example.name}
          >
            {example.name}
          </MenuItem>
        )}
      />
      <div className={css.content}>
        <ReactToVueEditor {...reactToVueContext} />
        {reactError && (
          <>
            <h2>Error</h2>
            <p>{reactError.message}</p>
          </>
        )}
        <Button
          onClick={modalContext.open}
          variant="contained"
        >
          Compare
        </Button>
      </div>
      <Modal>
        <DiffEditor
          original={reactCode}
          modified={vueCode}
          language="javascript"
          height="500px"
        />
      </Modal>
    </div>
  );
}
