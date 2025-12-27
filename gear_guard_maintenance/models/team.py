# -*- coding: utf-8 -*-
from odoo import api, fields, models


class GgMaintenanceTeam(models.Model):
    _name = 'gg.maintenance.team'
    _description = 'Maintenance Team'

    name = fields.Char(required=True)
    member_ids = fields.Many2many('res.users', string='Technicians')
    color = fields.Integer(string='Color')
