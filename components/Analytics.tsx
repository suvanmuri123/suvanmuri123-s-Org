import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AnalyticsData, Mood, MoodValue } from '../types';
import { format, parseISO, subDays } from 'date-fns';

const colors = {
    highlight: '#DE3163',
    accent: '#FADADD',
    textSecondary: '#71797E',
    textPrimary: '#36454F',
    secondary: '#FFFFFF'
}

interface AnalyticsProps {
  data: AnalyticsData[];
  moods: Mood[];
}

const Analytics: React.FC<AnalyticsProps> = ({ data, moods }) => {
    
    const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();
    
    const moodMapping: { [key in MoodValue]: number } = {
        '😍': 5,
        '😊': 4,
        '🙂': 3,
        '😐': 2,
        '😟': 1,
        '😠': 0,
    };
    
    const moodEmojis: MoodValue[] = ['😠', '😟', '😐', '🙂', '😊', '😍'];

    const chartData = last7Days.map(dateStr => {
        const dayData = data.find(d => d.date === dateStr);
        const moodData = moods.find(m => m.date === dateStr);

        return {
            name: format(parseISO(dateStr), 'MMM d'),
            completed: dayData ? dayData.completed : 0,
            mood: moodData ? moodData.mood : null,
            moodValue: moodData ? moodMapping[moodData.mood] : null
        };
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
            <div className="p-4 bg-secondary/80 backdrop-blur-sm rounded-lg shadow-lg border border-accent">
                <p className="label font-bold text-text-primary">{`${label}`}</p>
                <p style={{color: colors.highlight}}>{`Completed: ${payload[0].value}`}</p>
                {payload[1] && payload[1].payload.mood && <p style={{color: colors.textPrimary}}>{`Mood: ${payload[1].payload.mood}`}</p>}
            </div>
            );
        }
        return null;
    };
    

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-text-primary">Your Productivity</h2>
            <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-lg h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5, right: 30, left: 0, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.accent}/>
                        <XAxis dataKey="name" stroke={colors.textSecondary} />
                        <YAxis yAxisId="left" stroke={colors.textSecondary} allowDecimals={false} />
                        <YAxis yAxisId="right" orientation="right" stroke={colors.textSecondary} domain={[0, 5]} ticks={[0,1,2,3,4,5]} tickFormatter={(value) => moodEmojis[value] || ''} tick={{fontSize: 20}} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="completed" stroke={colors.highlight} strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="moodValue" stroke="#F4C2C2" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;