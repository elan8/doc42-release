package Monitor {
    part def TemperatureMonitor;
    part monitor : TemperatureMonitor;

    requirement def <'CR-001'> VisibleAlarm {
        subject system : TemperatureMonitor;
        doc /* The operator needs a visible indication when the monitored temperature is unsafe.
             * This is an authored customer need; no execution verdict is claimed. */
    }
    requirement def <'SR-001'> AlarmResponse {
        subject system : TemperatureMonitor;
        doc /* The monitor shall display an alarm within two seconds after the input exceeds
             * the configured limit. This sample publishes a prose-only requirement; its
             * acceptance predicate is not evaluated by Doc42. */
    }
}
