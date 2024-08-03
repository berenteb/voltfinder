import Bowser from 'bowser';
import { useEffect, useMemo, useState } from 'react';
import { TbShare2, TbSquarePlus } from 'react-icons/tb';

import { Button } from '@/components/button';
import { isPromptDismissed, setPromptDismissed } from '@/services/storage.service';

export function PwaPrompt() {
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    let displayMode = 'browser tab';
    if (window.matchMedia('(display-mode: standalone)').matches) {
      displayMode = 'standalone';
    }

    if (displayMode === 'browser tab' && !isPromptDismissed()) {
      setPromptOpen(true);
    }
  }, []);

  const onDismiss = () => {
    setPromptDismissed();
    setPromptOpen(false);
  };

  const platform = useMemo(() => Bowser.parse(window.navigator.userAgent).platform.type, []);

  if (!promptOpen) {
    return null;
  }

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 p-5 z-20 flex items-center justify-center max-h-screen'>
      <div className='bg-white rounded-lg border-2 border-slate-50 p-10 space-y-5 overflow-auto max-w-screen-md h-fit max-h-full'>
        <h1 className='text-center font-bold text-4xl'>
          Üdvözöllek a<br />
          Voltfinder alkalmazásban!
        </h1>
        <p className='text-center'>Keress villámtöltőket az országban és találd meg a számodra legmegfelelőbbet!</p>
        <p className='text-center text-slate-500 italic'>
          {platform === 'mobile'
            ? 'Az alkalmazás jobb felhasználói élményt nyújt, ha a kezdőképernyődre mentve használod.'
            : 'Használd az alklalmazást telefonodon is, a kezdőképernyődre mentve!'}
        </p>
        {platform === 'mobile' && <SafariPwaPrompt />}
        <Button
          onClick={onDismiss}
          className='w-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 border-blue-100'
        >
          Bezárás
        </Button>
      </div>
    </div>
  );
}

function SafariPwaPrompt() {
  return (
    <ol>
      <li>
        Nyisd meg a{' '}
        <b>
          „<TbShare2 className='inline' /> Megosztás”
        </b>{' '}
        menüt: <br />
        Miután az oldal betöltődött, keresd meg a{' '}
        <b>
          „<TbShare2 className='inline' /> Megosztás”
        </b>{' '}
        ikont a képernyő alján. Ez egy négyzet, amelyből egy nyíl felfelé mutat.
      </li>
      <li>
        Válaszd a{' '}
        <b>
          „<TbSquarePlus className='inline' /> Főképernyőhöz adás”
        </b>{' '}
        lehetőséget:
        <br />A megosztás menüben görgess lefelé, amíg meg nem találod a{' '}
        <b>
          „<TbSquarePlus className='inline' /> Főképernyőhöz adás”
        </b>{' '}
        opciót, majd koppints rá.
      </li>
      <li>
        Add hozzá a kezdőképernyőhöz:
        <br />A következő képernyőn látni fogod az app ikonját és nevét. Koppints az <b>„Hozzáadás”</b> gombra a jobb
        felső sarokban.
      </li>
      <li>
        Nyisd meg az appot a kezdőképernyőről:
        <br />
        Most már megtalálod az appot a kezdőképernyődön. Koppints az ikonra az app elindításához.
      </li>
    </ol>
  );
}
