<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
        '\App\Console\Commands\SendKAPEmail',
        '\App\Console\Commands\SendContractRenewalEmail',
        '\App\Console\Commands\SendLeadDatabaseFollowupEmail',
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
        $schedule->command('SendKAPFollowupReminderEmail:sendKAPFollowpEmails')
                 ->everyMinute()
                 ->withoutOverlapping();
                 // ->emailOutputTo('tanveer.khan@mrhomecare.in');

        $schedule->command('SendContractRenewalReminderEmail:sendContractRenewalEmails')
                 ->everyMinute()
                 ->withoutOverlapping();
                 // ->emailOutputTo('tanveer.khan@mrhomecare.in');

        $schedule->command('SendLeadDatabaseFollowupEmail:sendLeadDatabaseFollowupEmails')
                 ->everyMinute()
                 ->withoutOverlapping();
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
