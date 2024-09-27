import { TbMessage } from 'react-icons/tb';

import { Button } from '@/components/button';
import { Tooltip } from '@/components/tooltip';

export function FeedbackButton() {
  const handleClick = () => {
    window.open('https://forms.gle/NstdsSQhyLG8Q8m98');
  };
  return (
    <Tooltip text='Visszajelzés'>
      <Button onClick={handleClick}>
        <TbMessage size={30} />
      </Button>
    </Tooltip>
  );
}
