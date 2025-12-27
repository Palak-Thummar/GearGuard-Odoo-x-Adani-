# -*- coding: utf-8 -*-
from odoo import api, fields, models


class GgEquipment(models.Model):
    _name = 'gg.equipment'
    _description = 'Equipment'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Equipment Name', required=True, tracking=True)
    serial_no = fields.Char(string='Serial Number', tracking=True)
    category_id = fields.Many2one('gg.equipment.category', string='Category', tracking=True)
    purchase_date = fields.Date(tracking=True)
    warranty_end = fields.Date(string='Warranty End', tracking=True)
    location = fields.Char(string='Location', tracking=True)
    department_id = fields.Many2one('hr.department', string='Department', tracking=True)
    employee_id = fields.Many2one('hr.employee', string='Employee Owner', tracking=True)
    maintenance_team_id = fields.Many2one('gg.maintenance.team', string='Maintenance Team', tracking=True)
    technician_id = fields.Many2one('res.users', string='Default Technician', tracking=True)
    is_scrapped = fields.Boolean(string='Scrapped', default=False, tracking=True)

    request_count_open = fields.Integer(string='Open Requests', compute='_compute_request_counts')

    def _compute_request_counts(self):
        Request = self.env['gg.maintenance.request']
        for rec in self:
            rec.request_count_open = Request.search_count([
                ('equipment_id', '=', rec.id),
                ('stage_id.is_done', '=', False),
            ])

    def action_view_requests(self):
        self.ensure_one()
        action = self.env.ref('gear_guard_maintenance.action_gg_maintenance_request').read()[0]
        action['domain'] = [('equipment_id', '=', self.id)]
        action['context'] = {'default_equipment_id': self.id, 'search_default_group_by_stage': 1}
        return action
