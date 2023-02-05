import React from "react";
import styles from '../styles/Create-campaign.Rectangle.module.css'
import { Input } from '@nextui-org/react';
import { Grid, Card, Text, Button, Loading, Spacer } from "@nextui-org/react";
import { LockIcon } from './LockIcon';

const MockItem = ({ text }) => {
    return (
      <Card css={{ h: "$20", $$cardColor: '$colors$primary' }}>
        <Card.Body>
          <Text h6 size={15} color="white" css={{ m: 0 }}>
            {text}
          </Text>
        </Card.Body>
      </Card>
    );
  };
  

const Rectangle = () => {
  return (
    <div className={styles.rectangle}>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Input clearable label="Company name" placeholder="Company name" />
        </Grid>
        <Grid xs={6}>
          <Input clearable label="Industry" placeholder="Industry" />
        </Grid>
        <Grid xs={6}>
          <Input clearable label="Percentage of Equity" placeholder="Percentage of Equity" />
        </Grid>
        <Grid xs={6}>
          <Input clearable label="Shares Offered" placeholder="Shares Offered"/>
        </Grid>
        <Grid xs={6}>
          <Input clearable label="Price per Share" placeholder="Price per Share" />
        </Grid>
        <Grid xs={6}>
            <div>
          <Input 
            width="186px" 
            label="Deadline" 
            type="time" 
          />
          <div style={{height: 10}}></div>
          <Input 
            width="186px" 
            type="date" 
          />
          </div>
        </Grid>
      </Grid.Container>
      <Spacer y={0.4}/>
      <div style={{ display: "flex", justifyContent: "center" }}>
      <Button icon={<LockIcon fill="currentColor" />} color="gradient" size='lg' >
        Lock
        <Loading type="points" color="currentColor" size="sm" />
      </Button>
      </div>
    </div>
  );
};

export default Rectangle;
