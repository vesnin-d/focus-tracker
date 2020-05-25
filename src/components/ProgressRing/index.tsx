import React, { FC } from 'react';
import './index.scss';

export interface Props {
    radius: number;
    stroke: number;
    progress: number;
}

const ProgressRing: FC<Props> = ({ radius, stroke, progress }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress / 100 * circumference;
  
    return (
        <div className='progress-ring'>
            <svg    
                height={radius * 2}
                width={radius * 2}
            >
                <circle
                    stroke='white'
                    fill='transparent'
                    strokeWidth={ stroke }
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke='#f08594'
                    fill='transparent'
                    strokeWidth={ stroke }
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        </div>
      
    );
};

export default ProgressRing
/*
class ProgressRing extends React.Component {
    constructor(props) {
      super(props);
      
      const { radius, stroke } = this.props;
      
      
    }
    
    render() {
      
    }

}
*/  
// class Example extends React.Component {
//     constructor(props) {
//       super(props);
      
//       this.state = {
//         progress: 0
//       };
//     }
    
//     componentDidMount() {
//       // emulating progress
//       const interval = setInterval(() => {
//         this.setState({ progress: this.state.progress + 10 });
//         if (this.state.progress === 100)
//           clearInterval(interval);
//       }, 1000);
//     }
    
//     render() {
//       return (
//         <ProgressRing
//           radius={ 60 }
//           stroke={ 4 }
//           progress={ this.state.progress }
//         />
//       );
//     }
// }
