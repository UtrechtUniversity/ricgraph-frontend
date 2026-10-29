import {useState} from "react";
import {Button, Card, Stack} from "react-bootstrap";

export interface HistogramItem {
    name: string;
    value: number;
}

interface Props {
    title: string;
    items: HistogramItem[];
    max: number;
    mode?: "counts" | "percentages";
}

function Histogram({title, items, max, mode = "counts"}: Props) {
    const [percentageFirst, setPercentageFirst] = useState(mode === "percentages");

    // Don't render an empty histogram.
    if (items.length === 0) return null;

    const total = items.reduce((sum, item) => sum + item.value, 0);

    function barWidth(item: HistogramItem) {
        if (mode === "percentages") return total > 0 ? (item.value / total) * 100 : 0;
        return (item.value / max) * 100;
    }

    function percentageOf(item: HistogramItem) {
        return total > 0 ? Math.round((item.value / total) * 100) : 0;
    }

    // Up to 5 evenly spaced ticks (0%, 25%, 50%, 75%, 100% of the axis)
    // Except for if there's only 0 and 1
    const axisMax = mode === "percentages" ? 100 : max;
    const tickCount = mode === "percentages" ? 5 : Math.max(1, Math.min(5, axisMax + 1));
    const tickFractions = tickCount === 1 ? [0]
        : Array.from({length: tickCount}, (_, i) => i / (tickCount - 1));
    const ticks = tickFractions.map(fraction => ({
        position: fraction * 100,
        label: mode === "percentages"
            ? `${Math.round(axisMax * fraction)}%`
            : String(Math.round(axisMax * fraction)),
    }));

    return (
        <Card>
            <Card.Header
                className="text-dark d-flex align-items-center justify-content-between gap-2"
                style={{backgroundColor: "var(--uu-yellow)"}}
            >
                <span>{title}</span>
                <Button
                    size="sm"
                    variant="outline-dark"
                    onClick={() => setPercentageFirst(prev => !prev)}
                    title={percentageFirst ? "Show count first" : "Show percentage first"}
                >
                    {percentageFirst ? "Show count first" : "Show % first"}
                </Button>
            </Card.Header>

            <Card.Body className="text-dark">
                <Stack gap={2}>
                    {items.map(item => (
                        <div
                            key={item.name}
                            className="position-relative d-flex align-items-center overflow-hidden px-2 py-1"
                            style={{minHeight: "26px"}}
                        >
                            {/* Yellow bar */}
                            <div
                                className="position-absolute top-0 bottom-0 start-0 rounded"
                                style={{
                                    width: `${barWidth(item)}%`,
                                    backgroundColor: "var(--uu-yellow)",
                                    zIndex: 0,
                                }}
                            />

                            {/* Labels */}
                            <div
                                className="position-relative d-flex justify-content-between w-100 gap-3"
                                style={{zIndex: 1}}
                            >
                                <span>{item.name}</span>
                                <span>
                                    {percentageFirst
                                        ? <>{percentageOf(item)}%</>
                                        : <>{item.value}</>}
                                    {" "}
                                    <span className="text-muted small">
                                        ({percentageFirst ? item.value : `${percentageOf(item)}%`})
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))}
                </Stack>

                <div className="position-relative mt-3" style={{height: "24px"}}>

                    {/* tick marks */}
                    {ticks.map(tick => (
                        <div
                            key={tick.position}
                            className="position-absolute top-0"
                            style={{
                                left: `${tick.position}%`,
                                width: "1px",
                                height: "6px",
                                backgroundColor: "currentColor",
                                transform: tick.position === 0 ? undefined
                                    : tick.position === 100 ? "translateX(-100%)"
                                        : "translateX(-50%)",
                            }}
                        />
                    ))}

                    {/* tick labels */}
                    <div className="position-absolute start-0 end-0" style={{top: "8px", height: "16px"}}>
                        {ticks.map(tick => (
                            <span
                                key={tick.position}
                                className="position-absolute small"
                                style={{
                                    left: `${tick.position}%`,
                                    transform: tick.position === 0 ? undefined
                                        : tick.position === 100 ? "translateX(-100%)"
                                            : "translateX(-50%)",
                                }}
                            >
                                {tick.label}
                            </span>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Histogram;