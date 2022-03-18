<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\KAPController;

class SendKAPEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'SendKAPFollowupReminderEmail:sendKAPFollowpEmails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send KAP Followup Reminder Emails';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        (new KAPController)->send_kap_reminders();
    }
}
