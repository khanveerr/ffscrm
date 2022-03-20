<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\LeadController;

class SendLeadDatabaseFollowupEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'SendLeadDatabaseFollowupEmail:sendLeadDatabaseFollowupEmails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send Lead Database Followup Emails';

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
        (new LeadController)->send_lead_database_followup_reminders();
    }
}
