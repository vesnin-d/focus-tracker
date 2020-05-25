import React, { FC } from 'react';

export interface Props {
    iconType: string;
    additionalClasses?: string;
}

const Icon: FC<Props> = ({
    iconType,
    additionalClasses = ''
}) => (<i className={`material-icons ${additionalClasses}`}>{iconType}</i>);

export default Icon;