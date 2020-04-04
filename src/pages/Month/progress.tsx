import React from 'react';
import { Col, Progress as ProgressRS, Row } from 'reactstrap';

import { Text } from '../../components';
import { amount } from '../../helpers';

interface IProps {
  result: number;
  goal: number;
  percentage: number;
  label: string;
}

const Progress = ({ result, goal, percentage, label }: IProps) => {
  const text = `$${amount(Math.abs(result), false, true)} ${
    result > 0 ? 'over' : 'left'
  }`;

  return (
    <>
      <Row>
        <Col>
          <Text>{label}</Text>
        </Col>
        <Col className="text-right">
          {result !== 0 && (
            <Text className={result >= 0 ? 'text-success' : 'text-danger'}>
              {text}
            </Text>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="mb-2">
          <ProgressRS
            value={percentage}
            color={result >= 0 ? 'success' : 'danger'}
          >
            {result + goal !== 0 && '$'}
            {amount(result + goal, false, true)}
          </ProgressRS>
        </Col>
      </Row>
    </>
  );
};

export default Progress;
