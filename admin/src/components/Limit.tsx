import React from 'react'
import {IDay, IStat} from "../api/events";

interface Props {
    day :IDay;
    stat :IStat;
}

const Limit:React.FC<Props> = ({day, stat}) => {
    const splitLimits = day.limit_boys != null || day.limit_girls != null

    if (splitLimits) {
        return (
            <span>{stat.boys_count}CH + {stat.girls_count}D / {stat.capacity}(max.{stat.limit_boys}CH + max.{stat.limit_girls}D)</span>
        )
    }
    return (
        <span>{stat.boys_count + stat.girls_count}/{stat.capacity}</span>
    )

}

export default Limit
