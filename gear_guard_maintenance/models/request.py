# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import UserError


class GgMaintenanceRequest(models.Model):
    _name = 'gg.maintenance.request'
    _description = 'Maintenance Request'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'priority desc, scheduled_date, id desc'

    name = fields.Char(default=lambda self: _('New'), tracking=True)
    type = fields.Selection([
        ('corrective', 'Corrective'),
        ('preventive', 'Preventive'),
    ], string='Request Type', default='corrective', required=True, tracking=True)
    equipment_id = fields.Many2one('gg.equipment', string='Equipment', required=True, tracking=True)
    category_id = fields.Many2one('gg.equipment.category', string='Equipment Category', tracking=True)
    team_id = fields.Many2one('gg.maintenance.team', string='Maintenance Team', tracking=True)
    user_id = fields.Many2one('res.users', string='Technician', tracking=True)
    scheduled_date = fields.Datetime(string='Scheduled Date', tracking=True)
    duration = fields.Float(string='Hours Spent')
    description = fields.Text()
    stage_id = fields.Many2one('gg.request.stage', string='Stage', tracking=True, index=True)
    priority = fields.Selection([('0', 'Normal'), ('1', 'High')], default='0')

    is_overdue = fields.Boolean(compute='_compute_is_overdue', store=True)

    @api.depends('scheduled_date', 'stage_id')
    def _compute_is_overdue(self):
        now = fields.Datetime.now()
        for rec in self:
            rec.is_overdue = bool(rec.scheduled_date and rec.scheduled_date < now and not (rec.stage_id and rec.stage_id.is_done))

    @api.onchange('equipment_id')
    def _onchange_equipment_id(self):
        for rec in self:
            if rec.equipment_id:
                rec.category_id = rec.equipment_id.category_id
                rec.team_id = rec.equipment_id.maintenance_team_id
                if not rec.user_id:
                    rec.user_id = rec.equipment_id.technician_id

    @api.model
    def create(self, vals):
        # Default stage is the first "New" stage
        if not vals.get('stage_id'):
            stage = self.env['gg.request.stage'].search([('name', '=', 'New')], limit=1)
            if stage:
                vals['stage_id'] = stage.id
        # Name sequence
        if vals.get('name', _('New')) == _('New'):
            vals['name'] = self.env['ir.sequence'].next_by_code('gg.maintenance.request') or _('New')
        rec = super().create(vals)
        return rec

    def action_assign_to_me(self):
        self.ensure_one()
        self.user_id = self.env.user

    def _stage_by_name(self, name):
        stage = self.env['gg.request.stage'].search([('name', '=', name)], limit=1)
        if not stage:
            raise UserError(_('Stage "%s" is not configured.') % name)
        return stage

    def action_start(self):
        self.ensure_one()
        self.stage_id = self._stage_by_name('In Progress')

    def action_mark_repaired(self):
        self.ensure_one()
        self.stage_id = self._stage_by_name('Repaired')

    def action_move_to_scrap(self):
        self.ensure_one()
        self.stage_id = self._stage_by_name('Scrap')

    def write(self, vals):
        # Detect scrap transition to flag equipment
        res = super().write(vals)
        if 'stage_id' in vals:
            scrap_stage = self.env['gg.request.stage'].browse(vals['stage_id']) if vals['stage_id'] else False
            for rec in self:
                if scrap_stage and scrap_stage.is_scrap and rec.equipment_id:
                    if not rec.equipment_id.is_scrapped:
                        rec.equipment_id.is_scrapped = True
                        rec.equipment_id.message_post(body=_('Equipment marked as scrapped due to request %s moving to Scrap.') % rec.name)
        return res
