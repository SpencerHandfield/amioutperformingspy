import React from 'react'
import {useState, useEffect, memo} from 'react'
import Invalid from './Invalid'
import Negative from './Negative'
import Positive from './Positive'

function Popup(props) {
  const [isInvalid, setIsInvalid] = useState(true)
  const [isPositive, setIsPositive] = useState(false)
  const [isNegative, setIsNegative] = useState(false)
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    checkTicker()
  }, [props])



  const checkTicker = () => {
    console.log("checking", props.data)
    let receivedData = props.data
    // TODO: when initially rendering, there is a flicker of invalid, this is hardcode to avoid that
    // either use callback or component lifecycle to allow for initial render when data is properly set
    // OR backend can have flag for invalid data that we use rather than empty array (negative number?)
    if(receivedData.ticker !== "init-wxyz"){
      setDisplay(true)
    }
    //if user deletes their ticker and plays with years there should not be a warning
    if(receivedData.ticker === ""){
      setDisplay(false)
    }
    if(receivedData.user_values.length === 0){
        setIsInvalid(true)
        setIsPositive(false)
        setIsNegative(false)
    }else {
        setIsInvalid(false)
        let user_start = receivedData.user_values[0]
        let user_end = receivedData.user_values[receivedData.user_values.length-1]
        let spy_start = receivedData.spy_values[0]
        let spy_end = receivedData.spy_values[receivedData.user_values.length-1]
        let user_return = (user_end-user_start)/user_start
        let spy_return = (spy_end-spy_start)/spy_start
        // can maybe chart graph based on %change like the yf chart
        if (user_return > spy_return) {
            props.setColour("green")
            setIsPositive(true)
            setIsNegative(false)
        }else {
            props.setColour("red")
            setIsPositive(false)
            setIsNegative(true)
        }
    }
  }

  return (
    <div>
        {display && isInvalid && <Invalid/>}
        {display && isPositive && <Positive/>}
        {display && isNegative && <Negative/>}
    </div>
  )
}

export default Popup
