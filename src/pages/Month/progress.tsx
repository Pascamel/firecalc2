import React from 'react';
import { Col, Progress as ProgressRS, Row } from 'reactstrap';

import { Text } from '../../components';
import { amount } from '../../helpers';

interface IProps {
  className?: string;
  result: number;
  goal: number;
  percentage: number;
  label: string;
}

const Progress = ({ result, goal, className, percentage, label }: IProps) => {
  const text = `$${amount(Math.abs(result), false, true)} ${
    result > 0 ? 'over' : 'left'
  }`;
  const color = result >= 0 ? 'success' : 'danger';

  return (
    <div className={className}>
      <Row>
        <Col>
          <Text>{label}</Text>
          {result !== 0 && (
            <Text className="pull-right" color={color}>
              {text}
            </Text>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="mb-2">
          <ProgressRS value={percentage} color={color}>
            {result + goal !== 0 && '$'}
            {amount(result + goal, false, true)}
          </ProgressRS>
        </Col>
      </Row>
    </div>
  );
};

export default Progress;
