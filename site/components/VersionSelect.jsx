import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Listbox, Transition } from '@headlessui/react';
import { IoChevronDown, IoCheckmarkSharp } from 'react-icons/io5';
import { ApiVersionContext } from '@utils/ApiVersionContext';
import styles from './VersionSelect.module.css';

const VersionSelect = ({ className, ...props }) => {
  const router = useRouter();
  const { version, setVersion, apiVersions } = useContext(ApiVersionContext);

  const current = apiVersions.find(ver => {
    return ver.value === version;
  });

  function onVersionChange(v) {
    setVersion(v);
    router.push(`/docs/${v}`);
  }

  return (
    <div className={clsx('relative w-40', className)} {...props}>
      <Listbox value={version} onChange={v => onVersionChange(v)}>
        <Listbox.Button className={styles.button}>
          <span className="block truncate">{current ? current.text : ''}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <IoChevronDown
              className="w-5 h-5 text-warm-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={styles.options}>
            {apiVersions.map(ver => (
              <Listbox.Option
                key={ver.value}
                value={ver.value}
                className={({ active }) => `${active ? 'text-orange-900 bg-orange-100' : 'text-warm-900'} cursor-default select-none relative py-2 pl-10 pr-4`}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                      {ver.text}
                    </span>
                    {selected ? (
                      <span className={`${active ? 'text-orange-600' : 'text-orange-600'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                        <IoCheckmarkSharp className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default VersionSelect;
