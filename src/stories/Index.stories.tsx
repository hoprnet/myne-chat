import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import HomePage from '../../pages/index';
import { enableMapSet } from 'immer';

enableMapSet(); // Required by useImmer as we use maps

export default {
  title: 'Components/Index',
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = (args) => {
    return (<HomePage {...args} />)
};

export const Default = Template.bind({});