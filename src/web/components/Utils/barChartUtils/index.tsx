const tickPercentageFormatter = (percentageValuesArray: any) => {
      return (<tspan>
          {
            percentageValuesArray.map((item: string) => {
              return <tspan x="0" dy="50px">{item}</tspan>
            })
          }
      </tspan>);
    }


const tickLabelFormatter = (labelValuesArray: any) => {
      return (<tspan>
          {
            labelValuesArray.map((item: string) => {
              return <tspan x="0" dy="50px">{item}</tspan>
            })
          }
      </tspan>);
    }

export {tickPercentageFormatter, tickLabelFormatter}